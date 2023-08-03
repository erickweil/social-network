//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
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
                URLImage(
                    urlString: APIURL+postagem.usuario.fotoPerfil
                ).frame(width: 60)
                Text(postagem.usuario.nome)
            }.frame(maxWidth: .infinity, alignment: Alignment.leading)
            
            Text(postagem.conteudo)
            
            if postagem.imagens.count >= 1 {
                URLImage(
                    urlString: APIURL+postagem.imagens[0]
                ).frame(height: 250)
            }
        }
        .background(.background)
    }
}

// View que lista as postagens
struct InicioView: View {
    @StateObject var viewModel = PostagensViewModel()
    
    var body: some View {
        NavigationView {
            List {
                ForEach(viewModel.postagens, id: \.self) { postagem in
                    PostagemView(postagem: postagem)
                }
            }
            .listStyle(PlainListStyle())
            .navigationTitle("Postagens")
            .onAppear {
                // Assim que aparecer na tela faz o fetch
                viewModel.fetch()
            }
        }
    }
}

struct InicioView_Previews: PreviewProvider {
    static var previews: some View {
        InicioView()
    }
}
