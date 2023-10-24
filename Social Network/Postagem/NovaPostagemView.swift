//
//  NovaPostagemView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 19/10/23.
//

import SwiftUI

struct NovaPostagemView: View {
    
    @EnvironmentObject private var store: LoginViewModel
    
    @Environment(\.dismiss) var dismiss
        
    @StateObject private var vm: NovaPostagemViewModel// = NovaPostagemViewModel()
    
    var onNovoPost: (Postagem) -> Void
    
    init(postagemPai: Postagem? = nil, onNovoPost: @escaping (Postagem) -> Void) {
        _vm = StateObject(wrappedValue: NovaPostagemViewModel(postagemPai: postagemPai))
        self.onNovoPost = onNovoPost
    }
    
    
    var body: some View {
        Form {
            
            if let postagemPai = vm.postagemPai {
                VStack {
                    PostagemView(post: PostViewModel(postagem: postagemPai), exibirComoResposta: true, exibirBotoes: false)
                }
                .background(Color.secundaria)
                .padding()
                
                Divider()
            }
            
            MeuInput("", texto: $vm.conteudo, erro: vm.erroConteudo, tipo: .multilineText)
                .textInputAutocapitalization(.sentences)
                .exibirBorda(false)
                .iniciarFocado()
                .keyboardType(.default)
                .frame(minHeight: 56)
        }
        .plainFormStyle()
        .navigationTitle(vm.postagemPai != nil ? "Nova Resposta" : "Nova Postagem")
        .toolbar() {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Cancelar") {
                    dismiss();
                }
            }
            
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Postar") {
                    if vm.validarFormulario() {
                        Task {
                            do {
                                if let novoPost = try await vm.realizarCadastro(token: store.token) {
                                    DispatchQueue.main.async {
                                        vm.setarMensagemErro("Postado com sucesso!")
                                        onNovoPost(novoPost)
                                        dismiss()
                                    }
                                }
                            } catch NetworkError.unauthorized {
                                DispatchQueue.main.async {
                                    store.estaLogado = false
                                }
                            } catch {
                                DispatchQueue.main.async {
                                    vm.setarMensagemErro(error.localizedDescription)
                                }
                            }
                        }
                    }
                }.buttonStyle(.borderedProminent)
            }
        }
        .alert(vm.mensagemErro, isPresented: $vm.exibirMensagemErro) {
            Button("Fechar") {
                
            }.buttonStyle(.bordered)
        }
    }
}

struct NovaPostagemView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            NovaPostagemView(onNovoPost: { post in
                print(post)
            })
        }
    }
}
