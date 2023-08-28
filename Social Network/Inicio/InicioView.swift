//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

// View que lista as postagens
struct InicioView: View {
    var body: some View {
        TabView {
            NavigationView {
                PostagemListView()
                    .navigationTitle("Para Você")
                    .toolbar {
                        InicioToolbar()
                    }
            }
            .tabItem() {
                Image(systemName: "house")
            }
            NavigationView {
                PostagemListView(mostrarPostagensCurtidas: true)
                    .navigationTitle("Curtidas")
                    .toolbar {
                        InicioToolbar()
                    }
            }.tabItem() {
                Image(systemName: "heart")
            }
            
            NavigationView {
                SideMenuDrawerTeste()
            }.tabItem {
                Image(systemName: "magnifyingglass")
            }
            Text("Tela Configurações").tabItem {
                Image(systemName: "gear")
            }
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
