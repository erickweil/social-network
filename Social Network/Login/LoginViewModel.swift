//
//  LoginViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import Foundation
import SwiftUI

class LoginViewModel: ObservableObject {
    @AppStorage("LOGIN_EMAIL")
    var email: String = ""
    
    @AppStorage("LOGIN_SENHA")
    var senha: String = ""
    
    @AppStorage("LOGIN_TOKEN")
    public var token: String = ""
        
    public var usuario: Usuario? = nil
    
    // false mantém a tela login aberta, true vai para a próxima tela
    @Published var navegarLogin = false
    
    @Published var exibirMensagemErro: Bool = false
    private(set) var mensagemErro: String = ""
    
    @Published var erroEmail: String?
    @Published var erroSenha: String?
    
    func setarMensagemErro(_ erro: String) {
        mensagemErro = erro
        if erro == "" {
            exibirMensagemErro = false
        } else {
            exibirMensagemErro = true
        }
    }
    
    func validaObrigatorio(_ txt: String) -> String? {
        if txt.isEmpty {
            return "Este campo é obrigatório"
        } else {
            return nil
        }
    }
    
    func validaEmail(_ txt: String) -> String? {
        // https://www.hackingwithswift.com/articles/108/how-to-use-regular-expressions-in-swift
        let regexPattern = "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
        let regex = try! NSRegularExpression(pattern: regexPattern)
        if let match = regex.firstMatch(in: txt, range: NSRange(location: 0, length: txt.utf16.count)) {
            return nil
        } else {
            return "Email inválido"
        }
    }
    
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
        
        guard resp.success else {
            throw NetworkError.errorResponse("Usuário e/ou senha Incorretos")
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

