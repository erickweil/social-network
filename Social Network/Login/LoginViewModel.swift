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
        
        @AppStorage("LOGIN_SENHA")
        var senha: String = ""
        
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
        
        func validarFormulario() -> Bool {
            print("Clicou, email:\(email) senha:\(senha)")
            let emailTrimmed = email.trimmingCharacters(in: .whitespaces)
            guard !emailTrimmed.isEmpty && !senha.isEmpty else {
                DispatchQueue.main.async {
                    self.setarMensagemErro("Preencha todos os campos")
                }
                return false
            }
            
            // Só chega aqui se não der nenhum erro
            self.setarMensagemErro("")
            return true
        }
        
    }
}
