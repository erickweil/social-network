//
//  NovaPostagemViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 19/10/23.
//

import SwiftUI

class NovaPostagemViewModel: FomularioViewModel {
    var postagemPai: Postagem?
    
    // Inputs
    @Published var conteudo: String
    @Published var erroConteudo: String?
    
    init(postagemPai: Postagem? = nil) {
        self.postagemPai = postagemPai
        self.conteudo = ""
        self.erroConteudo = nil
    }
        
    func validarFormulario() -> Bool {
        erroConteudo = validaObrigatorio(conteudo)
        
        guard erroConteudo == nil else {
            return false
        }
        
        // Só chega aqui se não der nenhum erro
        self.setarMensagemErro("")
        return true
    }
    
    // Só deve chamar realizarCadastro() se validarFormulario() der true
    public func realizarCadastro(token: String) async throws -> Postagem? {
        
        var multipartBody: [String : (Data, filename: String?)] = [:]
        
        multipartBody["conteudo"] = (conteudo.data(using: .utf8)!, nil)
        if let postagemPai {
            multipartBody["postagemPai"] = (postagemPai.id.data(using: .utf8)!, nil)
        }
        let resp = try await HTTPClient.instance.fetch(
            APIs.postagens.url,
            FetchOptions(
                method: .POST,
                headers: ["Authorization": "Bearer \(token)"],
                multipartBody: multipartBody
            )
        )
        
        if let error = resp.error {
            if resp.httpResponse.statusCode == 400 {
                let respModel = try resp.json(NovaPostagemErroResponse.self)
                
                if let message = respModel.message {
                    DispatchQueue.main.async {
                        self.setarMensagemErro(message)
                    }
                    return nil
                } else if let validation = respModel.validation {
                    DispatchQueue.main.async {
                        self.erroConteudo = validation.conteudo
                        
                        if let postMessage = validation.postagem {
                            self.setarMensagemErro(postMessage)
                        }
                    }
                    return nil
                }
            }
            throw error
        }
        
        let respModel = try resp.json(Postagem.self)
        return respModel
    }
}
