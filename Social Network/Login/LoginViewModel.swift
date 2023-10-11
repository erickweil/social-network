//
//  LoginViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import Foundation
import SwiftUI
extension NovoLoginView {
    class ViewModel: ObservableObject {
        @AppStorage("LOGIN_EMAIL")
        var email: String = ""
        @Published var erroEmail: String?
        
        @AppStorage("LOGIN_SENHA")
        var senha: String = ""
        @Published var erroSenha: String?
        
        
        @Published
        var exibirMensagemErro: Bool = false
        private(set) var mensagemErro: String = ""
        
        
        @Published
        var autenticado: Bool = false
        
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
    }
}
