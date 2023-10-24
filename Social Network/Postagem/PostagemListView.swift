//
//  PostagemListView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 27/08/23.
//

import SwiftUI

struct PostagemListView: View {
    var postagemPai: Postagem?
    var mostrarPostagensCurtidas: Bool
    // Estado local desta tela
    // @StateObject ->  mantém o valor mesmo em redraws
    // @ObservedObject -> recriado quando acontece um redraw
    @StateObject var viewModel: PostagensViewModel
    
    // Estado global da aplicação
    @EnvironmentObject private var store: LoginViewModel
    
    init(postagemPai: Postagem? = nil, mostrarPostagensCurtidas: Bool = false, abrirResposta: Bool = false) {
        self.postagemPai = postagemPai
        self.mostrarPostagensCurtidas = mostrarPostagensCurtidas
        self._viewModel = StateObject(wrappedValue: PostagensViewModel(navegarNovaPostagem: abrirResposta))
    }
        
    func carregarPostagens(_ token: String) async {
        // Assim que aparecer na tela faz o fetch
        do {
            try await viewModel.fetchPostagens(
                token: token,
                postagemPai: postagemPai,
                postagensCurtidas: mostrarPostagensCurtidas
            )
        } catch NetworkError.unauthorized {
            store.estaLogado = false
        } catch {
            print(error.localizedDescription)
            viewModel.mensagemErro = error.localizedDescription
            viewModel.exibirMensagemErro = true
        }
    }
    
    
    var body: some View {
        if store.estaLogado {
            if let postagens = viewModel.postagens {
                VStack {
                    List {
                        
                        if let postagemPai {
                            PostagemView(
                                post: PostViewModel(postagem: postagemPai),
                                exibirComoResposta: false,
                                limitarLinhas: false,
                                onComentar: {
                                    viewModel.navegarNovaPostagem = true
                                }
                            )
                        }
                        
                        if postagens.count > 0 {
                            ForEach(postagens, id: \.self) { postagem in
                                PostagemView(
                                    post: PostViewModel(postagem: postagem),
                                    exibirComoResposta: postagem.postagemPai != nil
                                )
                            }
                            
                            if viewModel.temMais {
                                PostagemSkeleton()
                                    .onAppear {
                                        print("Apareceu o skel carregar mais")
                                        Task {
                                            await carregarPostagens(store.token)
                                        }
                                    }
                            }
                        }
                    }
                    .listStyle(PlainListStyle())
                    
                    if postagemPai != nil {
                        Divider()
                        Text("Adicione uma resposta")
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                            .onTapGesture {
                                viewModel.navegarNovaPostagem = true
                            }
                            .background(Color.fundo)
                    }
                }
                .sheet(isPresented: $viewModel.navegarNovaPostagem) {
                    NavigationView {
                        NovaPostagemView(postagemPai: postagemPai ,onNovoPost: { post in
                            viewModel.resetarPostagens()
                            
                            // Não precisa! porque já vai carregar
                            //Task {
                            //    await carregarPostagens(store.token)
                            //}
                        })
                    }
                }
                .toolbar() {
                    if postagemPai == nil {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Postar") {
                                viewModel.navegarNovaPostagem = true
                            }
                        }
                    }
                }
                .alert(viewModel.mensagemErro, isPresented: $viewModel.exibirMensagemErro) {
                    Button("Fechar") {
                        
                    }.buttonStyle(.bordered)
                }
            } else {
                List {
                    ForEach(0..<3) { i in
                        PostagemSkeleton()
                    }
                }
                .listStyle(PlainListStyle())
                .task {
                    await carregarPostagens(store.token)
                }
            }
        } else {
            Text("Precisa autenticar")
        }
    }
}

struct PostagemListView_Previews: PreviewProvider {
    static var previews: some View {
        Text("OK")
    }
}
