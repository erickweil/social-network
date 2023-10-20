//
//  PostagensViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 09/07/23.
//

import Foundation



// https://www.appypie.com/urlsession-swift-networking-how-to
class PostagensViewModel: ObservableObject {
    // Published para que ao mudar atualize o View
    @Published var postagens: [Postagem]? = nil
    var proxPagina: Int = 1
    var temMais: Bool = true
    
    @Published var exibirMensagemErro: Bool = false
    var mensagemErro: String = ""
    
    // false mantém a tela login aberta, true vai para a próxima tela
    @Published var navegarNovaPostagem = false
    
    func resetarPostagens() {
        proxPagina = 1
        temMais = true
        postagens = nil
    }
    
    func fetchPostagens(token: String, postagemPai: Postagem? = nil, postagensCurtidas: Bool = false) async throws {
        guard temMais else {
            print("Não tem mais... não precisa carregar")
            return
        }

        var url: URL
        if postagensCurtidas {
            url = APIs.postagensCurtidas.url
        } else if postagemPai != nil {
            url = APIs.respostasPostagem(postagemPai!._id).url
        } else {
            url = APIs.postagens.url
        }
        
        try url.addQueryComponents([.init(name: "pagina", value: "\(proxPagina)")])
        
        let resp = try await HTTPClient.instance.fetch(url,
            FetchOptions(
                method: .GET,
                headers: ["Authorization": "Bearer \(token)"]
            )
        )
        
        if let error = resp.error {
            throw error
        }
        
        let respModel = try resp.json(ListagemPostagem.self)
        
        DispatchQueue.main.async {
            if respModel.resposta.count < respModel.limite {
                self.temMais = false
            }
            
            if self.postagens != nil {
                self.postagens!.append(contentsOf: respModel.resposta)
            } else {
                self.postagens = respModel.resposta
            }
            self.proxPagina = respModel.pagina+1
        }
        
        /*
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(token, forHTTPHeaderField: "Authorization")
         
         // weak self para não causar memory leak?
        // o que é guard?
        let task = session.dataTask(with: request) {
            [weak self] data, _, error in
            guard let data = data, error == nil else {
                print("Retornou no data...")
                return
            }
            
            do {
                print(String(decoding:data, as: UTF8.self))
                // Realiza o parsing do json de acordo com o formato da struct ListagemPostagem
                let listagem = try JSONDecoder().decode(ListagemPostagem.self, from: data)
                
                // Não pode afetar UI de outro queue a não ser o main
                DispatchQueue.main.async {
                    self?.postagens = listagem.resposta
                }
            }
            catch {
                print(error)
            }
        }
        task.resume()*/
    }
}
