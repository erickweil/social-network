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
    @Published var postagens: [Postagem] = []
    
    func fetchPostagens(token: String, session: URLSession, httpClient: HTTPClient) async throws {
        let resp = try await httpClient.load(
            Resource(
                url: APIs.postagens.url,
                modelType: ListagemPostagem.self
            ),
            session: session,
            headers: ["Authorization": "Bearer \(token)"]
        )
        
        DispatchQueue.main.async {
            self.postagens = resp.resposta
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
