//
//  HTTPFetch.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 27/08/23.
//

import Foundation

enum NetworkError: Error {
    case badRequest(String)
    case invalidResponse
    case decodingError(String)
    case errorResponse(String)
    case invalidURL(String)
}

extension NetworkError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .badRequest(let msg):
            return NSLocalizedString("Não foi possível processar a requisição: \(msg)", comment: "badRequestError")
        case .invalidResponse:
            return NSLocalizedString("Resposta Inválida", comment: "invalidResponse")
        case .decodingError(let msg):
            return NSLocalizedString("Não conseguiu decodificar a resposta: \(msg)", comment: "decodingError")
        case .errorResponse(let msg):
            return NSLocalizedString("Resposta de Erro: \(msg)", comment: "errorResponse")
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
    let headers: [String: String]
    let body: Data?
    let redirect: FetchRedirect
        
    init(method: HTTPMethod, headers: [String: String] = [:], body: Data? = nil,redirect: FetchRedirect = .follow) {
        self.method = method
        self.headers = headers
        self.body = body
        self.redirect = redirect
    }
}

struct HTTPClient {

    struct FetchResponse {
        let body: Data?
        let success: Bool
        let httpResponse: HTTPURLResponse
        
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
        
        for (header,value) in options.headers {
            request.addValue(value, forHTTPHeaderField: header)
        }
        
        // faz a chamada da requisição de fato
        let (data, response) = try await session.data(for: request)
        
        guard let httpResp = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        
        let result = FetchResponse(
            body: data,
            success: httpResp.statusCode >= 200 && httpResp.statusCode <= 299,
            httpResponse: httpResp
        )
        
        // Implementar redirecionar em respostas 3xx?
        // Será que todas as respostas 2xx são sucesso mesmo?
        
        //guard httpResp.statusCode >= 200 && httpResp.statusCode <= 299 else {
        //    throw NetworkError.serverError(result)
        //}
        
        return result
    }
}

