//
//  PostagemView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

func dataParaTempoDecorrido(data: String) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    if let parsedData = formatter.date(from: data) {
        let _min = 60.0
        let _hora = _min*60.0
        let _dia = _hora*24.0
        let _semana = _dia*7.0
        
        let interval = -parsedData.timeIntervalSinceNow
        if interval < 1 { return "agora mesmo" }
        else if interval < _min { return "\(Int(interval)) segundos" }
        else if interval < _hora { return "\(Int(interval/_min)) minutos" }
        else if interval < _dia { return "\(Int(interval/_hora)) horas" }
        else if interval < _semana { return "\(Int(interval/_dia)) dias" }
        else {
            let dateFormat = DateFormatter()
            dateFormat.dateFormat = "dd/MM/yyyy"
            return dateFormat.string(from: parsedData)
        }
    } else { return "desconhecido" }
}

struct PostagemSkeleton: View {
    @State var animLoading = false
    
    var body: some View {
        let off: CGFloat = animLoading ? 10 : 0
        HStack(alignment: .top, spacing: 10) {
            Color(.lightGray)
            .frame(width: 60,height:60)
            .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 0) {
                Color(.lightGray)
                .frame(width: 142, height: 17.0)
                .offset(y: off/10)
                                
                Color(.lightGray)
                .frame(height: 17.0)
                .padding(.top, 10)
                .offset(y: off/8)
                
                Color(.lightGray)
                .frame(height: 17.0)
                .padding(.top, 5)
                .offset(y: off/4)
                
                Color(.lightGray)
                .frame(width: 100, height: 17.0)
                .padding(.top, 5)
                .offset(y: off/2)
                
                Color(.lightGray)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .frame(height: 250)
                .padding(.top, 10)
                .offset(y: off)
                
                HStack {
                    Color(.lightGray)
                        .frame(width: 64.0, height: 32.0)
                        .padding(.trailing)
                    Color(.lightGray)
                        .frame(width: 64.0, height: 32.0)
                }
                .padding(.top, 10)
                .offset(y: off)
            }
        }
        .onAppear {
            withAnimation(.easeInOut.repeatForever(autoreverses:true)) {
                animLoading = true
            }
        }
        .background(.background)
    }
}

// View que representa uma Postagem
struct PostagemView: View {
    // Estado global da aplicação
    @EnvironmentObject private var store: LoginViewModel
        
    @ObservedObject
    var post: PostViewModel
    
    var exibirComoResposta: Bool
    
    var limitarLinhas: Bool = true
    
    func curtir() async {
        // Assim que aparecer na tela faz o fetch
        do {
            try await post.clicouCurtir(
                token: store.token
            )
        } catch {
            print(error.localizedDescription)
        }
    }
    
    @State var ativarLink: Bool = false
    func tituloNome(_ postagem: Postagem) -> some View {
        NavigationLink(destination: PostagemListView(postagemPai: postagem), isActive: $ativarLink) {
            if exibirComoResposta {
                HStack(spacing: 0) {
                    Text(postagem.usuario.nome)
                        .bold()
                    Text("・")
                        .foregroundColor(Color.secundaria)
                    Text(dataParaTempoDecorrido(data: postagem.created_at))
                        .foregroundColor(Color.secundaria)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                VStack(alignment: .leading) {
                    Text(postagem.usuario.nome)
                        .bold()
                    Text(dataParaTempoDecorrido(data: postagem.created_at))
                        .foregroundColor(Color.secundaria)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            
        }
    }
    
    func conteudo(_ postagem: Postagem) -> some View {
        Text(postagem.conteudo)
            .lineLimit(limitarLinhas ? 12 : 1000)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 5)
    }
    
    func barraBotoes(_ postagem: Postagem) -> some View {
        HStack {
            
            
            HeartSZIcon(filled: postagem.curtida ?? false)
                .frame(width: 24.0,height: 24.0)
                .foregroundColor((postagem.curtida ?? false) ? Color.destaque : Color.secundaria )
                .onTapGesture {
                    Task {
                        await curtir()
                    }
                }
            Text("\(postagem.numCurtidas)")
                .frame(width: 60)
            
            Image(systemName: "message")
                .resizable()
                 .scaledToFit()
                 .frame(width: 24, height: 24)
                .onTapGesture {
                print("Comentar")
            }
            Text("\(postagem.numRespostas)")
                .frame(width: 60)
            
            Spacer()
        }
        .padding(.top, 10)
        .foregroundColor(Color.secundaria)
    }
    
    var body: some View {
        let postagem: Postagem = post.postagem
        
        if exibirComoResposta {
            HStack(alignment: .top, spacing: 10) {
                FotoPerfilView(imgPath: postagem.usuario.fotoPerfil, width: 40)
                
                VStack(spacing: 0) {
                    tituloNome(postagem)
                    
                    conteudo(postagem)
                    
                    if postagem.imagens.count > 0 {
                        GaleriaImagens(imagens: postagem.imagens, baseURL: APIs.baseURL)
                            .frame(height: 250)
                            .padding(.top, 10)
                    }
                    
                    barraBotoes(postagem)
                }
            }
            .background(.background)
            .onTapGesture {
                // fire off NavigationLink
                ativarLink.toggle()
            }
        } else {
            VStack(spacing: 0) {
                HStack(alignment: .center, spacing: 10) {
                    FotoPerfilView(imgPath: postagem.usuario.fotoPerfil, width: 60)
                    tituloNome(postagem)
                }
                    
                conteudo(postagem)
                    .padding(.top, 10)
                    
                if postagem.imagens.count > 0 {
                    GaleriaImagens(imagens: postagem.imagens, baseURL: APIs.baseURL)
                        .frame(height: 250)
                        .padding(.top, 10)
                }
                
                barraBotoes(postagem)
            }
            .background(.background)
            .onTapGesture {
                // fire off NavigationLink
                ativarLink.toggle()
            }
        }
    }
    
    
}

struct PostagemView_Previews: PreviewProvider {
    static var previews: some View {
        //PostagemSkeleton()
        List {
            PostagemView(post: PostViewModel(postagem: Postagem.exemplo), exibirComoResposta: false)
                
            PostagemView(post: PostViewModel(postagem: Postagem.exemplo), exibirComoResposta: false)
                
            PostagemView(post: PostViewModel(postagem: Postagem.exemplo), exibirComoResposta: false)
                
        }
        .listStyle(.plain)
    }
}
