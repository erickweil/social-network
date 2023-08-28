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
            return parsedData.formatted()
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
    @EnvironmentObject private var store: AppDataStore
    
    @State var ativarLink: Bool = false
    
    let postagem: Postagem
    
    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            URLImage(
                url: APIs.baseURL.appendingPathComponent(postagem.usuario.fotoPerfil),
                imageCache: store.imageCache)
            {
                defaultPlaceholder()
            }
            .frame(width: 60)
            .clipShape(Circle())
            .foregroundColor(.secondary)
            
            VStack(spacing: 0) {
                NavigationLink(destination: PostagemListView(postagemPai: postagem), isActive: $ativarLink) {
                    HStack(spacing: 0) {
                        Text(postagem.usuario.nome)
                            .bold()
                        Text("・")
                            .foregroundColor(.secondary)
                        Text(dataParaTempoDecorrido(data: postagem.created_at))
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                
                Text(postagem.conteudo)
                    .lineLimit(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 5)
                
                if postagem.imagens.count > 0 {
                    GeometryReader { geo in
                        ScrollView(.horizontal, showsIndicators: false) {
                            LazyHStack {
                                ForEach(postagem.imagens, id: \.self) { imagem in
                                    URLImage(url: APIs.baseURL.appendingPathComponent(imagem),
                                             imageCache: store.imageCache
                                    ) {
                                        defaultPlaceholder()
                                    }
                                    .modifier(clipComBorda(shape:RoundedRectangle(cornerRadius: 10)))
                                    .foregroundColor(.secondary)
                                    .frame(maxWidth: geo.size.width)
                                }
                            }
                        }
                    }
                    .frame(height: 250)
                    .padding(.top, 10)
                }
                
                HStack {
                    Image(systemName: "hand.thumbsup").onTapGesture {
                        print("Curtir")
                    }
                    Text("\(postagem.numCurtidas)")
                        .padding(.trailing)
                    
                    Image(systemName: "message").onTapGesture {
                        print("Comentar")
                    }
                    Text("\(postagem.numRespostas)")
                        .padding(.trailing)
                    
                    Spacer()
                }
                .padding(.top, 10)
                .foregroundColor(.secondary)
            }
        }
        .background(.background)
        .onTapGesture {
            // fire off NavigationLink
            ativarLink.toggle()
        }
    }
    
    
}

struct PostagemView_Previews: PreviewProvider {
    static var previews: some View {
        Text("OK")
        //PostagemView(postagem: Postagem())
    }
}
