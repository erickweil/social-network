//
//  PostagemListView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 27/08/23.
//

import SwiftUI

struct PostagemListView: View {
    var postagemPai: Postagem?
    var mostrarPostagensCurtidas: Bool = false
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
    
    @Environment(\.httpClient) private var httpClient: HTTPClient
    
    // Estado local desta tela
    // @StateObject ->  mantém o valor mesmo em redraws
    // @ObservedObject -> recriado quando acontece um redraw
    @StateObject var viewModel = PostagensViewModel()
    
    
    func carregarPostagens(_ token: String) async {
        // Assim que aparecer na tela faz o fetch
        do {
            try await viewModel.fetchPostagens(
                token: token,
                httpClient: httpClient,
                postagemPai: postagemPai,
                postagensCurtidas: mostrarPostagensCurtidas
            )
        } catch {
            print(error.localizedDescription)
        }
    }
    
    
    var body: some View {
        if let token = store.session.token {
            if let postagens = viewModel.postagens {
                List {
                    
                    if let postagemPai {
                        PostagemView(
                            post: PostViewModel(postagem: postagemPai),
                            exibirComoResposta: false,
                            limitarLinhas: false
                        )
                    }
                    
                    if postagens.count == 0 {
                        if let postagemPai {
                            Text("Seja o primeiro a responder")
                        } else {
                            Text("Que vazio...")
                        }
                    } else {
                        ForEach(postagens, id: \.self) { postagem in
                            PostagemView(
                                post: PostViewModel(postagem: postagem),
                                exibirComoResposta: postagem.postagemPai != nil
                            )
                        }
                        
                        if viewModel.temMais {
                            PostagemSkeleton()
                                .onAppear {
                                    print("Apareceu o skel carregar mais")
                                    Task {
                                        await carregarPostagens(token)
                                    }
                                }
                        }
                    }
                }
                .listStyle(PlainListStyle())
            } else {
                List {
                    ForEach(0..<3) { i in
                        PostagemSkeleton()
                    }
                }
                .listStyle(PlainListStyle())
                .task {
                    await carregarPostagens(token)
                }
            }
        } else {
            Text("Precisa autenticar")
        }
    }
}

struct PostagemListView_Previews: PreviewProvider {
    static var previews: some View {
        Text("OK")
    }
}
