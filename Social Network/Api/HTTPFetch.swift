//
//  HTTPFetch.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 27/08/23.
//

import Foundation


enum NetworkError: Error {
    case badRequest
    case serverError(String)
    case decodingError(String)
    case invalidResponse
    case invalidURL
}

extension NetworkError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .badRequest:
            return NSLocalizedString("Não foi possível processar a requisição", comment: "badRequestError")
        case .serverError(let errorMessage):
            return NSLocalizedString(errorMessage, comment: "serverError")
        case .decodingError(let errorMessage):
            return NSLocalizedString(errorMessage, comment: "decodingError")
        case .invalidResponse:
            return NSLocalizedString("Resposta Inválida", comment: "invalidResponse")
        case .invalidURL:
            return NSLocalizedString("URL Inválido", comment: "invalidURL")
        }
    }
}

extension Data {
    func json<T: Codable>(_ modelType: T.Type) throws -> T {
        guard let result = try? JSONDecoder().decode(modelType, from: self) else {
            throw NetworkError.decodingError(String(decoding:self, as: UTF8.self))
        }
        
        return result
    }
}


extension URL {
    mutating func addQueryComponents(_ queryItems: [URLQueryItem]?) throws {
        var components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems = queryItems
        guard let url = components?.url else {
            throw NetworkError.badRequest
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
        let status: Int
        let httpResponse: HTTPURLResponse
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
            status: httpResp.statusCode,
            httpResponse: httpResp
        )
        
        // guarda a resposta no model passado
        //guard let body = try? JSONDecoder().decode(resource.modelType, from: data) else {
        //    throw NetworkError.decodingError(String(decoding:data, as: UTF8.self))
        //}
        
        return result
    }
}

