//
//  PostagemView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

// View que representa uma Postagem
struct PostagemView: View {
    let postagem: Postagem
    
    var body: some View {
        VStack {
            NavigationLink {
                PerfilUsuario()
            } label: {
                Text("Perfil")
            }
            HStack {
                URLImage(url: APIs.baseURL.appendingPathComponent(postagem.usuario.fotoPerfil)) {
                    defaultPlaceholder()
                }
                .frame(width: 60)
                Text(postagem.usuario.nome)
            }.frame(maxWidth: .infinity, alignment: Alignment.leading)
            
            Text(postagem.conteudo)
            
            if postagem.imagens.count >= 1 {
                URLImage(url: APIs.baseURL.appendingPathComponent(postagem.imagens[0])) {
                    defaultPlaceholder()
                }
                .frame(height: 250)
            }
        }
        .background(.background)
    }
}

struct PostagemView_Previews: PreviewProvider {
    static var previews: some View {
        Text("OK")
        //PostagemView(postagem: Postagem())
    }
}
