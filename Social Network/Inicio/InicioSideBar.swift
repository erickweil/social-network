//
//  InicioSideBar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct InicioSideBar: View {
        
    @Environment(\.inicioTabSelect) private var inicioTabSelect: Binding<InicioTabTelas>
    
    @EnvironmentObject private var store: LoginViewModel
    
    @Binding var menuOpened: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            
            // HEADER
            SideMenuHeader(usuario: store.usuario)
            
            // BODY
            VStack(alignment: .leading, spacing: 15) {
                
                SideMenuButton(
                    icon: { Image(systemName: "house.fill").resizable() },
                    title: "Início",
                    titleKey: .inicio,
                    selected: inicioTabSelect,
                    action: onClicouButton)
                
                SideMenuButton(
                    icon: { HeartSZIcon(
                        filled: true,
                        fillColor: inicioTabSelect.wrappedValue == .curtidas ? Color.destaque : Color.texto
                    ) },
                    title: "Curtidas",
                    titleKey: .curtidas,
                    selected: inicioTabSelect,
                    action: onClicouButton)
                
                SideMenuButton(
                    icon: { Image(systemName: "magnifyingglass").resizable() },
                    title: "Pesquisa",
                    titleKey: .pesquisa,
                    selected: inicioTabSelect,
                    action: onClicouButton)
                
                SideMenuButton(
                    icon: { Image(systemName: "gear").resizable() },
                    title: "Configurações",
                    titleKey: .configuracoes,
                    selected: inicioTabSelect,
                    action: onClicouButton)
                
                Divider()
                
                SideMenuButton(
                    icon: { Image(systemName: "door.left.hand.open").resizable() },
                    title: "Sair",
                    titleKey: .sair,
                    selected: .constant(.inicio),
                    action: onClicouButton)
                
            }
            .padding(10)
            
            Spacer()
        }
    }
    
    func onClicouButton(_ titleKey: InicioTabTelas) {
        switch titleKey {
        case .inicio:
            inicioTabSelect.wrappedValue = .inicio
            menuOpened.toggle()
            break
        case .curtidas:
            inicioTabSelect.wrappedValue = .curtidas
            menuOpened.toggle()
            break
        case .pesquisa:
            inicioTabSelect.wrappedValue = .pesquisa
            menuOpened.toggle()
            break
        case .configuracoes:
            inicioTabSelect.wrappedValue = .configuracoes
            menuOpened.toggle()
            break
        case .sair:
            store.estaLogado = false
            break
        }
    }
}

struct SideMenuHeader: View {
    var usuario: Usuario?
    var body: some View {
        VStack(alignment: .leading) {
            if let usuario {
                FotoPerfilView(imgPath: usuario.fotoPerfil, width: 80)
                
                Text(usuario.nome)
                    .font(.title2)
                    .bold()
                    .padding(.top, 10)
                    .foregroundColor(Color.texto)
                
                
                Text(usuario.email)
                    .font(.body)
                    .foregroundColor(Color.secundaria)
            } else {
                Color(.lightGray)
                    .frame(width: 60,height:60)
                    .clipShape(Circle())
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity,minHeight: 120, alignment: .leading)
        .background(
            LinearGradient(colors: [Color.fundo,Color(red: 0.9, green: 0.9, blue: 0.9)],
                           startPoint: .center, endPoint: .bottom
            )
            .ignoresSafeArea(.all))
    }
}

struct SideMenuButton<Icon>: View where Icon : View {
    var icon: () -> Icon
    var title: String
    var titleKey: InicioTabTelas
    var selected: Binding<InicioTabTelas>
    var action: (InicioTabTelas) -> Void
    var body: some View {
        Button (action: {
            selected.wrappedValue = titleKey
            action(titleKey)
        }) {
            HStack(spacing: 32) {
                icon()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 28, height: 28)
                Text(title)
                    .font(.subheadline)
            }
            .foregroundColor(selected.wrappedValue == titleKey ? Color.destaque : Color.texto)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(10)
            .background{
                if selected.wrappedValue == titleKey {
                    RoundedRectangle(cornerRadius: 5)
                        .fill(Color.destaque)
                        .opacity(0.25)
                }
            }
        }
    }
}

struct InicioSideBar_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            NovoLoginView {
                TabView {
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
                .sideMenuDrawer(menuOpened: .constant(true)) {
                    InicioSideBar(menuOpened: .constant(true))
                }
            }
        }
    }
}
