//
//  PostagensViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 09/07/23.
//

import Foundation

// Structs para fazer o parse do JSON que a api responde
struct Usuario: Hashable, Codable {
    let _id: String
    let nome: String
    let fotoPerfil: String
    let fotoCapa: String
    let biografia: String
    let created_at: String
    let updated_at: String
}

struct Postagem: Hashable, Codable {
    let _id: String
    let usuario: Usuario
    let conteudo: String
    let hashtags: [String]
    let imagens: [String]
    let numCurtidas: Int
    let numRespostas: Int
    let nivel: Int
    let deletado: Bool?
    let created_at: String
    
    let postagemPai: String?
    let posicao: Int?
    let respostas: [Postagem]?
}

struct ListagemPostagem: Hashable, Codable {
    let resposta: [Postagem]
    let pagina: Int
    let limite: Int
}

class PostagensViewModel: ObservableObject {
    // Published para que ao mudar atualize o View
    @Published var postagens: [Postagem] = []
    
    func fetch() {
        guard let url = URL(string: "https://erick.fslab.dev/absproxy/3000/postagens") else {
            print("Retornou no url...")
            return
        }
        
        // weak self para não causar memory leak?
        // o que é guard?
        let task = URLSession.shared.dataTask(with: url) {
            [weak self] data, _, error in
            guard let data = data, error == nil else {
                print("Retornou no data...")
                return
            }
            
            do {
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
        task.resume()
    }
}
