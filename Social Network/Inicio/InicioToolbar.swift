//
//  InicioToolbar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct InicioToolbar: ToolbarContent {
    
    @EnvironmentObject private var store: AppDataStore
    
    var body: some ToolbarContent {
        ToolbarItemGroup(placement: .navigationBarLeading) {
            if let usuario = store.session.usuario {
                URLImage(
                    url: APIs.baseURL.appendingPathComponent(usuario.fotoPerfil),
                    imageCache: store.imageCache)
                {
                    defaultPlaceholder()
                }
                .frame(width: 40, height: 40)
                .clipShape(Circle())
                .foregroundColor(.secondary)
                
            } else {
                Text("Fazer Login")
            }
        }
    }
}

struct InicioToolbar_Previews: PreviewProvider {
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
                    .toolbar {
                        InicioToolbar()
                    }
            }
        }.environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
