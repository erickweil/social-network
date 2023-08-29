//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

// View que lista as postagens
struct InicioView: View {    
    @State var menuOpened: Bool = false
    var body: some View {
        TabView {
            NavigationView {
                PostagemListView()
                    .navigationTitle("Para Você")
                    .inicioToolbar(menuOpened: $menuOpened)
            }
            .tabItem() {
                Image(systemName: "house")
            }
            NavigationView {
                PostagemListView(mostrarPostagensCurtidas: true)
                    .navigationTitle("Curtidas")
                    .inicioToolbar(menuOpened: $menuOpened)
            }.tabItem() {
                Image(systemName: "hand.thumbsup")
            }
            
            NavigationView {
                ViewExample(imageName: "magnifyingglass", color: .systemBlue)
            }.tabItem {
                Image(systemName: "magnifyingglass")
            }
            
            NavigationView {
                ViewExample(imageName: "gear", color: .systemOrange)
            }.tabItem {
                Image(systemName: "gear")
            }
        }
        .sideMenuDrawer(menuOpened: $menuOpened) {
            InicioSideBar(menuOpened: $menuOpened)
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
