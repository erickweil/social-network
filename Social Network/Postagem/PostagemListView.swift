//
//  PostagemListView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 27/08/23.
//

import SwiftUI

struct PostagemListView: View {
    var postagemPai: Postagem?
    
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
    
    // Estado local desta tela
    // @StateObject ->  mantém o valor mesmo em redraws
    // @ObservedObject -> recriado quando acontece um redraw
    @StateObject var viewModel = PostagensViewModel()
    
    
    func carregarPostagens(_ token: String) async {
        // Assim que aparecer na tela faz o fetch
        do {
            try await viewModel.fetchPostagens(
                token: token,
                httpClient: store.httpClient,
                postagemPai: postagemPai
            )
        } catch {
            print(error.localizedDescription)
        }
    }
    
    
    var body: some View {
        if let token = store.session.token {
            if let postagens = viewModel.postagens {
                if postagens.count == 0 {
                    Text("Que vazio...")
                } else {
                    List {
                        ForEach(postagens, id: \.self) { postagem in
                            PostagemView(postagem: postagem)
                        }
                        //Text("Carregar Mais")
                        //    .onAppear {
                        //        print("Carregar mais")
                        //    }
                    }
                    .listStyle(PlainListStyle())
                    .navigationTitle("Postagens")
                }
            } else {
                List {
                    ForEach(0..<16) { i in
                        PostagemSkeleton()
                    }
                }
                .listStyle(PlainListStyle())
                .navigationTitle("Postagens")
                .task {
                    Task {
                        await carregarPostagens(token)
                    }
                }
            }
        } else {
            Text("Precisa autenticar")
        }
    }
}

struct PostagemListView_Previews: PreviewProvider {
    static var previews: some View {
        PostagemListView()
    }
}
