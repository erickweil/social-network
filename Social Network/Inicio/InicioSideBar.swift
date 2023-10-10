//
//  InicioSideBar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct InicioSideBar: View {
    
    
    @Environment(\.fezLogin) private var fezLogin: Binding<Bool>
    
    @EnvironmentObject private var store: AppDataStore
    
    @Binding var menuOpened: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            
            // HEADER
            VStack(alignment: .leading) {
                if let usuario = store.session.usuario {
                    if menuOpened {
                        FotoPerfilView(imgPath: usuario.fotoPerfil, width: 80)
                    }
                    
                    Text(usuario.nome)
                        .font(.title2)
                        .bold()
                        .padding(.top, 10)
                        .foregroundColor(.primary)
                    
                    
                    Text(usuario.email)
                        .font(.body)
                        .foregroundColor(.secondary)
                } else {
                    Color(.lightGray)
                        .frame(width: 60,height:60)
                        .clipShape(Circle())
                }
            }
            .padding(20)
            .frame(maxWidth: .infinity,minHeight: 120, alignment: .leading)
            .background(
                LinearGradient(colors: [Color(.systemBackground),Color(red: 0.9, green: 0.9, blue: 0.9)],
                               startPoint: .center, endPoint: .bottom
                )
                .ignoresSafeArea(.all))
                        
            // BODY
            VStack(alignment: .leading, spacing: 15) {
                
                HStack(spacing: 32) {
                    Image(systemName: "house.fill")
                        .renderingMode(.template)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 28, height: 28)
                    Text("Início")
                        .font(.subheadline)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(10)
                .background{
                    RoundedRectangle(cornerRadius: 5)
                        .fill(Color.accentColor)
                        .opacity(0.5)
                }
                
                Button (action: {
                    self.fezLogin.wrappedValue.toggle()
                }) {
                    HStack(spacing: 32) {
                        Image(systemName: "door.left.hand.open")
                            .renderingMode(.template)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 28, height: 28)
                        Text("Sair")
                            .font(.subheadline)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(10)
                }
            }
            .padding(10)
            
            Spacer()
        }
    }
}

struct InicioSideBar_Previews: PreviewProvider {
    static var previews: some View {
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
        .environmentObject(AppDataStore(fake: true))
    }
}
