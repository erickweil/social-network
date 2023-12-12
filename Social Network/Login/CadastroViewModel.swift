//
//  CadastroViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 19/10/23.
//

import SwiftUI

class CadastroViewModel: FomularioViewModel {
    // Inputs
    @Published var email: String = ""
    @Published var erroEmail: String?
    
    @Published var nome: String = ""
    @Published var erroNome: String?
    
    @Published var senha1: String = ""
    @Published var erroSenha1: String?
    
    @Published var senha2: String = ""
    @Published var erroSenha2: String?
    
    func validarFormulario() -> Bool {
        erroNome = validaObrigatorio(nome)
        erroEmail = validaObrigatorio(email) ?? validaEmail(email)
        erroSenha1 = validaObrigatorio(senha1)
        erroSenha2 = validaObrigatorio(senha2) ?? validaSenhaIgual(senha1, senha2)
        
        guard erroNome == nil, erroEmail == nil, erroSenha1 == nil, erroSenha2 == nil else {
            return false
        }
        
        // Só chega aqui se não der nenhum erro
        self.setarMensagemErro("")
        return true
    }
    
    // Só deve chamar realizarCadastro() se validarFormulario() der true
    public func realizarCadastro() async throws -> Usuario? {
        let resp = try await HTTPClient.instance.fetch(
            APIs.usuarios.url,
            FetchOptions(
                method: .POST,
                body: JSONEncoder().encode([
                    "nome": nome,
                    "email": email,
                    "senha": senha1
                ])
            )
        )
        
        if let error = resp.error {
            if resp.httpResponse.statusCode == 400 {
                let respModel = try resp.json(CadastrarErroResponse.self)
                
                if let message = respModel.message {
                    DispatchQueue.main.async {
                        self.setarMensagemErro(message)
                    }
                    return nil
                } else if let validation = respModel.validation {
                    DispatchQueue.main.async {
                        self.erroNome = validation.nome
                        self.erroEmail = validation.email
                        self.erroSenha1 = validation.senha
                    }
                    return nil
                }
            }
            
            throw error
        }
        
        let respModel = try resp.json(Usuario.self)
        return respModel
    }
}
