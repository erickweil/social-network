//
//  SessionModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

class APISessionViewModel {
    // https://stackoverflow.com/questions/52591866/whats-the-correct-usage-of-urlsession-create-new-one-or-reuse-same-one
    public var token: String?
    public var usuario: Usuario?
    
    public func fazerLogin(httpClient: HTTPClient,email: String, senha: String) async throws {
        let resp = try await httpClient.fetch(
            APIs.login.url,
            FetchOptions(
                method: .POST,
                body: JSONEncoder().encode([
                    "email": email,
                    "senha": senha
                ])
            )
        )
        
        guard resp.success else {
            throw NetworkError.errorResponse("Não conseguiu autenticar")
        }
        
        let respModel = try resp.json(LoginResponse.self)
        
        DispatchQueue.main.async {
            self.token = respModel.token
            self.usuario = respModel.usuario
        }
    }
}
