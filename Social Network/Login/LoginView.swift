//
//  LoginView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

// Depois fazer esta tela funcionar de verdade...
struct LoginView<Content>: View where Content: View {
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
    @State var shouldNavigate: Bool = false
    
    var content: () -> Content
    
    var body: some View {
        NavigationLink(
            isActive: $shouldNavigate,
            destination: content,
            label: {
                Text("Autenticando...")
                    .task {
                        // Assim que aparecer na tela faz o fetch
                        do {
                            try await store.session.fazerLogin(httpClient: store.httpClient,email: "joao@email.com", senha: "ABCDabcd1234")
                            shouldNavigate = true
                        } catch {
                            print(error.localizedDescription)
                        }
                    }
            }
        )
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        let store = AppDataStore(httpClient: HTTPClient())
        
        return NavigationView {
            LoginView {
                VStack {
                    if let token = store.session.token {
                        Text("OK FEZ LOGIN")
                        Text(token)
                            .textSelection(.enabled)
                            .padding()
                    } else {
                        Text("PRECISA AUTENTICAR")
                    }
                }
            }
        }
        .environmentObject(store)
    }
}
