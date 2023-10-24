//
//  CadastroView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 19/10/23.
//

import SwiftUI

struct CadastroView: View {
    
    @EnvironmentObject private var store: LoginViewModel
    
    @Environment(\.dismiss) var dismiss
    // Estado global da aplicação
    @StateObject private var vm: CadastroViewModel = CadastroViewModel()
    
    var body: some View {
        Form {
            Section("Informações") {
                MeuInput("Nome", texto: $vm.nome, erro: vm.erroNome)
                    .textInputAutocapitalization(.words)
                    .keyboardType(.namePhonePad)
                MeuInput("Email", texto: $vm.email, erro: vm.erroEmail)
                    .keyboardType(.emailAddress)
            }
            
            Section("Senha") {
                MeuInput("Senha", texto: $vm.senha1, erro: vm.erroSenha1, tipo: .password)
                MeuInput("Confirmar Senha", texto: $vm.senha2, erro: vm.erroSenha2, tipo: .password)
            }
            
            Button("Cadastrar") {
                if vm.validarFormulario() {
                    Task {
                        do {
                            if let usuario = try await vm.realizarCadastro() {
                                DispatchQueue.main.async {
                                    store.email = vm.email
                                    store.senha = vm.senha1
                                    vm.setarMensagemErro("Cadastrado com sucesso!")
                                    dismiss()
                                }
                            }
                        } catch {
                            DispatchQueue.main.async {
                                vm.setarMensagemErro(error.localizedDescription)
                            }
                        }
                    }
                }
            }
            .buttonStyle(.borderedProminent)
            .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .navigationTitle("Cadastrar")
        .toolbar() {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Cancelar") {
                    dismiss();
                }
            }
        }
        .alert(vm.mensagemErro, isPresented: $vm.exibirMensagemErro) {
            Button("Fechar") {
                
            }.buttonStyle(.bordered)
        }
    }
}

struct CadastroView_Previews: PreviewProvider {
    static var previews: some View {
        return NavigationView {
            CadastroView()
            .frame(maxWidth: .infinity,maxHeight: .infinity)
            .background(Color.secundaria,ignoresSafeAreaEdges: .all)
            .environmentObject(LoginViewModel())
        }
    }
}
