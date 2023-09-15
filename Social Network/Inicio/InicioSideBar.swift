//
//  InicioSideBar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct InicioSideBar: View {
    
    @EnvironmentObject private var store: AppDataStore
    
    @Binding var menuOpened: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            if let usuario = store.session.usuario {
                if menuOpened {
                    FotoPerfilView(imgPath: usuario.fotoPerfil, width: 60)
                }
                
                Text(usuario.nome)
                .padding(.top, 10)
            } else {
                Color(.lightGray)
                    .frame(width: 60,height:60)
                    .clipShape(Circle())
            }
            
            Divider()
            
            Spacer()
        }
    }
}

struct InicioSideBar_Previews: PreviewProvider {
    static var previews: some View {
        Text("OK")
//        InicioSideBar()
    }
}
