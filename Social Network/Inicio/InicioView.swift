//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

// View que lista as postagens
struct InicioView: View {
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
    
    // Estado local desta tela
    // @StateObject ->  mantém o valor mesmo em redraws
    // @ObservedObject -> recriado quando acontece um redraw
    @StateObject var viewModel = PostagensViewModel()
    
    
    var body: some View {
        NavigationView {
            if let token = store.session.token {
                List {
                    ForEach(viewModel.postagens, id: \.self) { postagem in
                        PostagemView(postagem: postagem)
                    }
                }
                .listStyle(PlainListStyle())
                .navigationTitle("Postagens")
                .task {
                    // Assim que aparecer na tela faz o fetch
                    do {
                        try await viewModel.fetchPostagens(
                            token: token,
                            session: store.session.session,
                            httpClient: store.httpClient
                        )
                    } catch {
                        print(error.localizedDescription)
                    }
                }
            } else {
                Text("Autenticando...")
                .task {
                    // Assim que aparecer na tela faz o fetch
                    do {
                        try await store.fazerLogin(email: "joao@email.com", senha: "ABCDabcd1234")
                    } catch {
                        print(error.localizedDescription)
                    }
                }
            }
            
        }
    }
}

struct InicioView_Previews: PreviewProvider {
    static var previews: some View {
        InicioView()
            .environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
