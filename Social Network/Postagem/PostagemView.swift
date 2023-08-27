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
// View que representa uma Postagem
struct PostagemView: View {
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
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
                HStack(spacing: 0) {
                    Text(postagem.usuario.nome)
                        .bold()
                    Text("・")
                        .foregroundColor(.secondary)
                    Text(dataParaTempoDecorrido(data: postagem.created_at))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            
                
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
                    Image(systemName: "hand.thumbsup")
                    Text("\(postagem.numCurtidas)")
                        .padding(.trailing)
                    
                    Image(systemName: "message")
                    Text("\(postagem.numRespostas)")
                        .padding(.trailing)
                    Spacer()
                }
                .padding(.top, 10)
                .foregroundColor(.secondary)
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
