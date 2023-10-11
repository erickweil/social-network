//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

enum InicioTabTelas: Int {
    case inicio = 1
    case curtidas = 2
    case pesquisa = 3
    case configuracoes = 4
    case sair = 5
}

// Indica se fez ou não Login
struct InicioTabSelectKey: EnvironmentKey {
    static let defaultValue: Binding<InicioTabTelas> = .constant(.inicio)
}

extension EnvironmentValues {
    var inicioTabSelect: Binding<InicioTabTelas> {
        get { return self[InicioTabSelectKey.self] }
        set { self[InicioTabSelectKey.self] = newValue }
    }
}

// View que lista as postagens
struct InicioView: View {
    @State var menuOpened: Bool = false
    @State var tabTela: InicioTabTelas = .inicio
    var body: some View {
        TabView(selection: $tabTela ) {
            NavigationView {
                PostagemListView()
                    .navigationTitle("Para Você")
                    .inicioToolbar(menuOpened: $menuOpened)
            }
            .tabItem() {
                Image(systemName: "house")
            }
            .tag(InicioTabTelas.inicio)
            
            NavigationView {
                PostagemListView(mostrarPostagensCurtidas: true)
                    .navigationTitle("Curtidas")
                    .inicioToolbar(menuOpened: $menuOpened)
            }.tabItem() {
                Image(systemName: "hand.thumbsup")
            }
            .tag(InicioTabTelas.curtidas)
            
            NavigationView {
                ViewExample(imageName: "magnifyingglass", color: .systemBlue)
                    .inicioToolbar(menuOpened: $menuOpened)
            }.tabItem {
                Image(systemName: "magnifyingglass")
            }
            .tag(InicioTabTelas.pesquisa)
            
            NavigationView {
                ViewExample(imageName: "gear", color: .systemOrange)
                    .inicioToolbar(menuOpened: $menuOpened)
            }.tabItem {
                Image(systemName: "gear")
            }
            .tag(InicioTabTelas.configuracoes)
        }
        .sideMenuDrawer(menuOpened: $menuOpened) {
            InicioSideBar(menuOpened: $menuOpened)
        }
        .environment(\.inicioTabSelect, $tabTela)
    }
}

struct InicioView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            NovoLoginView() {
                InicioView()
                    .navigationBarBackButtonHidden(true)
            }
        }.environmentObject(AppDataStore())
    }
}
