//
//  InicioSideBar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct InicioSideBar: View {
    
    @EnvironmentObject private var store: AppDataStore
    
    var body: some View {
        VStack(alignment: .leading) {
            if let usuario = store.session.usuario {
                URLImage(
                    url: APIs.baseURL.appendingPathComponent(usuario.fotoPerfil),
                    imageCache: store.imageCache)
                {
                    defaultPlaceholder()
                }
                .frame(width: 60, height: 60)
                .clipShape(Circle())
                .foregroundColor(.secondary)
            
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
        InicioSideBar()
    }
}
