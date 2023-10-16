//
//  SessionModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation
import SwiftUI

class APISessionViewModel: ObservableObject {
    // https://stackoverflow.com/questions/52591866/whats-the-correct-usage-of-urlsession-create-new-one-or-reuse-same-one
    @AppStorage("SESSION_TOKEN")
    public var token: String = ""
    
    @AppStorage("SESSION_USER")
    private var jsonUsuario: String = ""
    private var objUsuario: Usuario? = nil
    
    
    public var usuario: Usuario? {
        get {
            if objUsuario != nil {
                return objUsuario
            } else if !jsonUsuario.isEmpty {
                objUsuario = try? JSONDecoder().decode(Usuario.self, from:  jsonUsuario.data(using: .utf8)!)
                return objUsuario
            } else {
                return nil
            }
        }
        set {
            if newValue == nil {
                objUsuario = nil
                jsonUsuario = ""
            } else {
                objUsuario = newValue
                jsonUsuario = String(data: (try? JSONEncoder().encode(objUsuario))!, encoding: .utf8) ?? ""
            }
        }
    }
    
    public var estaLogado: Bool {
        return !token.isEmpty
    }
    
    public func fazerLogin(email: String, senha: String) async throws {
        let resp = try await HTTPClient.instance.fetch(
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
            throw NetworkError.errorResponse("Usuário e/ou senha Incorretos")
        }
        
        let respModel = try resp.json(LoginResponse.self)
        
        DispatchQueue.main.async {
            self.token = respModel.token
            self.usuario = respModel.usuario
        }
    }
}
