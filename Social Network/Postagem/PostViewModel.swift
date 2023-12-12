//
//  PostViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 29/08/23.
//

import Foundation

class PostViewModel: ObservableObject {
    // Published para que ao mudar atualize o View
    @Published public var postagem: Postagem
    
    func clicouCurtir(token: String) async throws {
        let url: URL = APIs.curtirPostagem(postagem._id).url
        var method: FetchOptions.HTTPMethod
        if postagem.curtida == nil || !(postagem.curtida!) {
            // Enviar POST para Curtir
            method = .POST
        } else {
            // Enviar DELETE para Des-curtir
            method = .DELETE
        }
        
        let resp = try await HTTPClient.instance.fetch(url,
            FetchOptions(
                method: method,
                headers: ["Authorization": "Bearer \(token)"]
            )
        )
        
        if let error = resp.error {
            throw error
        }
        
        let respModel = try resp.json(CurtidaResponse.self)
        
        DispatchQueue.main.async {
            self.postagem.curtida = respModel.estaCurtida
            self.postagem.numCurtidas = respModel.numCurtidas
        }
    }
        
    init(postagem: Postagem) {
        self.postagem = postagem
    }
    
    
}
