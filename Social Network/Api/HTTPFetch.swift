//
//  HTTPFetch.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 27/08/23.
//

import SwiftUI

struct NetworkErrorResponse: Codable {
    let code: Int
    let message: String?
}

enum NetworkError: Error {
    case badRequest(NetworkErrorResponse)
    case notFound(NetworkErrorResponse)
    case unauthorized(NetworkErrorResponse)
    case serverError(NetworkErrorResponse)
    case otherError(NetworkErrorResponse)
    
    case invalidResponse
    case decodingError(String)
    case invalidURL(String)
}

extension NetworkError: LocalizedError {
    
    var netInfo: NetworkErrorResponse? {
        switch self {
        case .badRequest(let e):
            return e
        case .notFound(let e):
            return e
        case .unauthorized(let e):
            return e
        case .serverError(let e):
            return e
        case .otherError(let e):
            return e
        default:
            return nil
        }
    }
    
    var errorDescription: String? {
        switch self {
        // 400
        case .badRequest(let e):
            return NSLocalizedString(e.message ?? "Solicitação Inválida", comment: "badRequestError")
        // 404
        case .notFound(let e):
            return NSLocalizedString(e.message ?? "Não Encontrado", comment: "badRequestError")
        // 498
        case .unauthorized(let e):
            return NSLocalizedString(e.message ?? "Não Autorizado", comment: "unauthorized")
        // 500
        case .serverError(let e):
            return NSLocalizedString("Erro Interno: \(e.message ?? "")", comment: "errorResponse")
            
        case .otherError(let e):
            return NSLocalizedString("Erro: \(e.message ?? "")", comment: "errorResponse")
            
            
        case .invalidResponse:
            return NSLocalizedString("Resposta Inválida", comment: "invalidResponse")
        case .decodingError(let msg):
            return NSLocalizedString("Não conseguiu decodificar a resposta: \(msg)", comment: "decodingError")
        case .invalidURL(let msg):
            return NSLocalizedString("URL Inválido: \(msg)", comment: "invalidURL")
        }
    }
}

// Para ser fácil adicionar componentes Query no URL
extension URL {
    mutating func addQueryComponents(_ queryItems: [URLQueryItem]?) throws {
        var components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems = queryItems
        guard let url = components?.url else {
            throw NetworkError.invalidURL("Query components inválidos.")
        }
        
        self = url
    }
}

extension Data {
    mutating func append(_ s: String) {
        self.append(s.data(using: .utf8)!)
    }
}

struct FetchOptions {
    enum HTTPMethod: String {
        case GET = "GET"
        case HEAD = "HEAD"
        case POST = "POST"
        case PUT = "PUT"
        case DELETE = "DELETE"
        case CONNECT = "CONNECT"
        case OPTIONS = "OPTIONS"
        case TRACE = "TRACE"
        case PATCH = "PATCH"
    }
    
    enum FetchRedirect {
        case follow
        case error
    }
    
    let method: HTTPMethod
    let headers: [String : String]
    let body: Data?
    let multipartBody: [String : (Data, filename: String?)]?
    let redirect: FetchRedirect
        
    init(method: HTTPMethod, headers: [String: String] = [:], body: Data? = nil,multipartBody: [String : (Data, filename: String?)]? = nil,redirect: FetchRedirect = .follow) {
        self.method = method
        self.headers = headers
        self.body = body
        self.multipartBody = multipartBody
        self.redirect = redirect
    }
}

struct ErrorResponse: Hashable, Codable {
    let error: Bool
    let message: String?
}

struct HTTPClient {
    
    static private var _instance: HTTPClient? = nil
    static var instance: HTTPClient {
        get {
            if let client = HTTPClient._instance {
                return client
            }
            
            print("Criou HTTPClient")
            let client = HTTPClient()
            HTTPClient._instance = client
            return client
        }
    }

    struct FetchResponse {
        init(httpResponse: HTTPURLResponse, body: Data? = nil, error: NetworkError? = nil) {
            self.body = body
            self.error = error
            self.httpResponse = httpResponse
        }
        
        let httpResponse: HTTPURLResponse
        let body: Data?
        var error: NetworkError?
        
        func json<T: Codable>(_ modelType: T.Type) throws -> T {
            guard let body else { throw NetworkError.decodingError("Resposta vazia, porém esperava resposta") }
            
            guard let decoded = try? JSONDecoder().decode(modelType, from: body) else {
                throw NetworkError.decodingError("Não conseguiu decodificar resposta. (\(body.count) bytes)")
            }
            
            return decoded
        }
    }
    
    public var session: URLSession
    public init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 30
        config.httpShouldSetCookies = true
        config.httpCookieAcceptPolicy = .always
        config.httpCookieStorage = HTTPCookieStorage.shared
        session = URLSession(configuration: config)
    }
    
    // https://developer.mozilla.org/en-US/docs/Web/API/fetch
    func fetch(_ resource: URL, _ options: FetchOptions = FetchOptions(method: .GET)) async throws -> FetchResponse {
        print(resource.absoluteString)
        
        var request = URLRequest(url: resource)
        request.httpMethod = options.method.rawValue
        
        if let body = options.body {
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = body
        }
        else if let multipart = options.multipartBody {
            // https://stackoverflow.com/questions/29623187/upload-image-with-multipart-form-data-ios-in-swift
            let boundary = UUID().uuidString
            request.addValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
            var body = Data()
            for (key, (data, filename)) in multipart {
                body.append("--\(boundary)\r\n")
                
                if let filename = filename {
                    body.append("Content-Disposition: form-data; name=\"\(key)\"; filename=\"\(filename)\"\r\n")
                }
                else {
                    body.append("Content-Disposition: form-data; name=\"\(key)\"\r\n")
                }
                
                body.append("\r\n")
                body.append(data)
                body.append("\r\n")
            }
            
            body.append("--\(boundary)--")
            request.httpBody = body
        }
        
        for (header,value) in options.headers {
            request.addValue(value, forHTTPHeaderField: header)
        }
        
        // faz a chamada da requisição de fato
        let (data, response) = try await session.data(for: request)
        
        guard let httpResp = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        
        let success = httpResp.statusCode >= 200 && httpResp.statusCode <= 299
        var result = FetchResponse(
            httpResponse: httpResp,
            body: data
        )
        
        if !success {
            let respModel = try? result.json(ErrorResponse.self)
            let errorMessage = NetworkErrorResponse(code: httpResp.statusCode, message: respModel?.message)
            
            switch(httpResp.statusCode) {
            case 400: result.error = NetworkError.badRequest(errorMessage)
            case 404: result.error = NetworkError.notFound(errorMessage)
            case 498: result.error = NetworkError.unauthorized(errorMessage)
            case 500..<600: result.error = NetworkError.serverError(errorMessage)
            default:
                result.error = NetworkError.otherError(errorMessage)
            }
        }

        // Implementar redirecionar em respostas 3xx?
        // Será que todas as respostas 2xx são sucesso mesmo?
        
        return result
    }
}

