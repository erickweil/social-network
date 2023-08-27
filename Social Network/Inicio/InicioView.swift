//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

// View que lista as postagens
struct InicioView: View {
    
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
            List {
                ForEach(viewModel.postagens, id: \.self) { postagem in
                    NavigationLink {
                        InicioView(postagemPai: postagem)
                    } label: {
                        PostagemView(postagem: postagem)
                    }
                }
            }
            .listStyle(PlainListStyle())
            .navigationTitle("Postagens")
            .task {
                await carregarPostagens(token)
            }
        } else {
            Text("Necessário Autenticar")
        }
    }
}

struct InicioView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            LoginView() {
                InicioView()
                    .navigationBarBackButtonHidden(true)
            }
        }.environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
