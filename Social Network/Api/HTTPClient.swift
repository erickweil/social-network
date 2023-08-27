//
//  HTTPClient.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
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

enum HTTPMethod {
    case get([URLQueryItem])
    case post(Data?)
    case delete
    
    var name: String {
        switch self {
        case .get:
            return "GET"
        case .post:
            return "POST"
        case .delete:
            return "DELETE"
        }
    }
}

struct Resource<T: Codable> {
    let url: URL
    var method: HTTPMethod = .get([])
    var modelType: T.Type
}

// Seria interessante ter um protocol HttpClient e um MockHttpClient para testes...
struct HTTPClient {
    // Função que retorna a sessão ou cria ela caso não exista
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
    
    func load<T: Codable>(_ resource: Resource<T>,
    headers: [String: String] = [:]
    ) async throws -> T {
        print(resource.url.absoluteString)
        var request = URLRequest(url: resource.url)
        
        // Constrói a requisição
        switch resource.method {
        case .get(let queryItems):
            var components = URLComponents(url: resource.url, resolvingAgainstBaseURL: false)
            components?.queryItems = queryItems
            guard let url = components?.url else {
                throw NetworkError.badRequest
            }
            
            request = URLRequest(url: url)
        case .post(let data):
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpMethod = resource.method.name
            request.httpBody = data
            
        case .delete:
            request.httpMethod = resource.method.name
        }
                
        //request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        for (header,value) in headers {
            request.addValue(value, forHTTPHeaderField: header)
        }
        
        // faz a chamada da requisição de fato
        let (data, response) = try await session.data(for: request)
        
        guard let _ = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        
        // guarda a resposta no model passado
        guard let result = try? JSONDecoder().decode(resource.modelType, from: data) else {
            throw NetworkError.decodingError(String(decoding:data, as: UTF8.self))
        }
        
        return result
    }
}
