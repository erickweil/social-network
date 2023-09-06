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
        var mensagemErro: String = ""
        
        
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
        
        func clicouOK(_ httpClient: HTTPClient) async {
            print("Clicou, email:\(email) senha:\(senha)")
            var emailTrimmed = email.trimmingCharacters(in: .whitespaces)
            guard !emailTrimmed.isEmpty && !senha.isEmpty else {
                DispatchQueue.main.async {
                    self.setarMensagemErro("Preencha todos os campos")
                }
                return
            }
                                
            guard let resp = try? await httpClient.fetch(
                APIs.login.url,
                FetchOptions(
                    method: .POST,
                    body: JSONEncoder().encode(
                        [
                            "email": emailTrimmed,
                            "senha": senha
                        ]
                    )
                )
            ) else {
                DispatchQueue.main.async {
                    self.setarMensagemErro("Não conseguiu fazer login")
                }
                return
            }
            
            print(String(decoding: resp.body!, as: UTF8.self))
                    
            guard let respModel = try? resp.json(LoginResponse.self) else {
                DispatchQueue.main.async {
                    self.setarMensagemErro("Falhou ao receber resposta do login")
                }
                return
            }
            
            // Aplica a mudança na UI no Main Queue
            DispatchQueue.main.async {
                // Só chega aqui se não der nenhum erro
                self.setarMensagemErro("")
                self.autenticado = true
            }
        }
    }
}
