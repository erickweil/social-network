//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

// Diz que no ios 15 para cima não precisaria disso...
struct URLImage: View {
    let urlString: String
    @State var data: Data?
    var body: some View {
        if let data = data, let uiimage = UIImage(data: data) {
            Image(uiImage: uiimage)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .background(Color.gray)
        } else {
            Image(systemName: "person.crop.rectangle")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .background(Color.gray)
                .onAppear {
                    fetchData()
                }
        }
    }
    
    // Tem que ver a questão do cache
    private func fetchData() {
        guard let url = URL(string: urlString) else {
            return
        }
        
        let task = URLSession.shared.dataTask(with: url) {
            data, _, _ in
            self.data = data
        }
        task.resume()
    }
}

// View que representa uma Postagem
struct PostagemView: View {
    let postagem: Postagem
    
    var body: some View {
        VStack {
            HStack {
                URLImage(
                    urlString: "https://erick.fslab.dev/absproxy/3000\(postagem.usuario.fotoPerfil)"
                ).frame(width: 60)
                Text(postagem.usuario.nome)
            }.frame(maxWidth: .infinity, alignment: Alignment.leading)
            
            Text(postagem.conteudo)
            
            if postagem.imagens.count >= 1 {
                URLImage(
                    urlString: "https://erick.fslab.dev/absproxy/3000\(postagem.imagens[0])"
                ).frame(height: 250)
            }
        }
        .background(.background)
    }
}

// View que lista as postagens
struct ContentView: View {
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

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
