//
//  InicioToolbar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

extension View {
    func inicioToolbar(menuOpened: Binding<Bool>) -> some View {
        modifier(InicioToolbar(menuOpened: menuOpened))
    }
}

struct InicioToolbar: ViewModifier {
    @EnvironmentObject private var store: AppDataStore
    
    @Binding var menuOpened: Bool
    
    func body(content: Content) -> some View {
        content
        .toolbar {
            ToolbarItemGroup(placement: .navigationBarLeading) {
                if let usuario = store.session.usuario {
                    FotoPerfilView(imgPath: usuario.fotoPerfil, width: 40)
                        .matchedGeometryEffect(id: usuario.fotoPerfil, in: store.AppNS!,
                                               properties: .size)
                        .onTapGesture {
                            menuOpened = true
                        }
                    
                    
                } else {
                    Text("Fazer Login")
                }
            }
        }
    }
}

struct InicioToolbar_Previews: PreviewProvider {
    
    static var opened: Binding<Bool> = .constant(true)
    
    static var previews: some View {
        NavigationView {
            LoginView() {
                List {
                    VStack {
                        PostagemSkeleton()
                        PostagemSkeleton()
                        PostagemSkeleton()
                        PostagemSkeleton()
                        PostagemSkeleton()
                    }
                }
                    .navigationBarBackButtonHidden(true)
                    .inicioToolbar(menuOpened: opened)
            }
        }.environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
