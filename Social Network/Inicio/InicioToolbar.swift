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
    @EnvironmentObject private var store: LoginViewModel
    
    @Binding var menuOpened: Bool
    
    func body(content: Content) -> some View {
        content
        .toolbar {
            ToolbarItemGroup(placement: .navigationBarLeading) {
                if store.estaLogado {
                    //FotoPerfilView(imgPath: usuario.fotoPerfil, width: 40)
                    Image(systemName: "line.3.horizontal")
                        .onTapGesture {
                            menuOpened = true
                        }
                    
                } else {
                    // Não deveria nunca acontecer mas né
                    Text("Fazer Login \(store.token)")
                        .onTapGesture {
                            store.estaLogado = false
                        }
                }
            }
        }
    }
}

struct InicioToolbar_Previews: PreviewProvider {
    
    static var opened: Binding<Bool> = .constant(true)
    
    static var previews: some View {
        NavigationView {
            NovoLoginView() {
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
        }
    }
}
