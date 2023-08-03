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

let APIURL = "https://socialize-api.app.fslab.dev"
enum ApiRotas: String {
    case Postagens = "/postagens"
    
    static func rota(_ rota: ApiRotas) -> String {
        APIURL + rota.rawValue
    }
}

// https://www.appypie.com/urlsession-swift-networking-how-to
class PostagensViewModel: ObservableObject {
    // Published para que ao mudar atualize o View
    @Published var postagens: [Postagem] = []
        
    // https://stackoverflow.com/questions/52591866/whats-the-correct-usage-of-urlsession-create-new-one-or-reuse-same-one
    static private var session: URLSession? = nil
    public static var session_token: String = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzAyNTFlMjI5NmU2MWUwZjUwMWJhNyIsIm5vbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2OTEwODgxMDgsImV4cCI6MTY5MTA5NTMwOH0.Wo42BYzPGiXijhe-lnYjDfxEVAMRKH5r-McGUk6azeo"
    public static func getSession() -> URLSession {
        if PostagensViewModel.session == nil {
            let config = URLSessionConfiguration.default
            config.timeoutIntervalForRequest = 30
            config.timeoutIntervalForResource = 30
            config.httpShouldSetCookies = true
            config.httpCookieAcceptPolicy = .always
            config.httpCookieStorage = HTTPCookieStorage.shared
            PostagensViewModel.session = URLSession(configuration: config)
        }
        
        return PostagensViewModel.session!
    }
    
    func fetch() {
        guard let url = URL(string: ApiRotas.rota(.Postagens)) else {
            print("Retornou no url...")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(PostagensViewModel.session_token, forHTTPHeaderField: "Authorization")
        
        let session = PostagensViewModel.getSession()
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
        task.resume()
    }
}
