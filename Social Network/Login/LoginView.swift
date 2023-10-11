//
//  LoginView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import SwiftUI

struct LoginView<Content>: View where Content: View {
    var content: () -> Content
    var body: some View {
        Text(/*@START_MENU_TOKEN@*/"Hello, World!"/*@END_MENU_TOKEN@*/)
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        let store = AppDataStore()
        
        return NavigationView {
            LoginView {
                VStack {
                    if store.session.estaLogado {
                        Text("OK FEZ LOGIN")
                        Text(store.session.token)
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
