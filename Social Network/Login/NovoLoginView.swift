//
//  NovoLoginView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import SwiftUI

struct NovoLoginView: View {
    @EnvironmentObject
    var store: AppDataStore
    
    @StateObject
    var vm: ViewModel = ViewModel()
    
    var body: some View {
        ZStack {
            NavigationLink("Clique", isActive: $vm.autenticado, destination: {
                PerfilUsuario()
                    .navigationBarBackButtonHidden(true)
            })
            
            Color("FundoLogin")
                .ignoresSafeArea()
            VStack {
                Text("Entrar")
                    .font(.title)
                TextField("Email", text: $vm.email)
                    .textFieldStyle(.roundedBorder)
                    .textInputAutocapitalization(.never)
                SecureField("Senha", text: $vm.senha)
                    .textFieldStyle(.roundedBorder)
                
                HStack {
                    Spacer()
                    Button("Ok") {
                        Task {
                            await vm.clicouOK(store.httpClient)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
                
                
            }
            .padding(20)
            .background {
                RoundedRectangle(cornerRadius: 20)
                    .foregroundColor(Color(.systemBackground))
            }
            .frame(maxWidth: 350)
            .padding(40)
        }
        .alert(vm.mensagemErro, isPresented: $vm.exibirMensagemErro) {
            Button("Fechar") {
                
            }.buttonStyle(.bordered)
        }
        
    }
}








struct NovoLoginView_Previews: PreviewProvider {
    static var previews: some View {
        NovoLoginView()
    }
}
