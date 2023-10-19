//
//  LoginViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import Foundation
import SwiftUI

class LoginViewModel: FomularioViewModel {
    @AppStorage("LOGIN_EMAIL")
    var email: String = ""
    
    @AppStorage("LOGIN_SENHA")
    var senha: String = ""
    
    @AppStorage("LOGIN_TOKEN")
    public var token: String = ""
        
    public var usuario: Usuario? = nil
    
    // false mantém a tela login aberta, true vai para a próxima tela
    @Published var navegarLogin = false
    
    
    // false mantém a tela login aberta, true vai para a próxima tela
    @Published var navegarCadastro = false
    
    @Published var erroEmail: String?
    @Published var erroSenha: String?
    
    func validarFormulario() -> Bool {
        erroEmail = validaObrigatorio(email) ?? validaEmail(email)
        erroSenha = validaObrigatorio(senha)
        
        guard erroEmail == nil, erroSenha == nil else {
            return false
        }
        
        // Só chega aqui se não der nenhum erro
        self.setarMensagemErro("")
        return true
    }
    
    
    public var estaLogado: Bool {
        get {
            return !token.isEmpty && usuario != nil
        }
        set {
            if newValue == false {
                token = ""
                usuario = nil
                navegarLogin = false
            }
        }
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
        
        if let error = resp.error {
            throw error
        }
        
        let respModel = try resp.json(LoginResponse.self)
        
        DispatchQueue.main.async {
            self.setarMensagemErro("")
            self.token = respModel.token
            self.usuario = respModel.usuario
            self.navegarLogin = true
        }
    }
}

