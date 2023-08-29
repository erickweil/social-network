//
//  GaleriaImagens.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 29/08/23.
//

import SwiftUI

struct GaleriaImagens: View {
    var imagens: [URL]
    var imageCache: ImageCacheViewModel?
    
    init(imagens: [URL], imageCache: ImageCacheViewModel? = nil) {
        self.imagens = imagens
        self.imageCache = imageCache
    }
    
    init(imagens: [String], baseURL: URL, imageCache: ImageCacheViewModel? = nil) {
        self.imagens = []
        self.imageCache = imageCache
        for imagem in imagens {
            self.imagens.append(baseURL.appendingPathComponent(imagem))
        }
    }
    
    var body: some View {
        GeometryReader { geo in
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack {
                    ForEach(imagens, id: \.self) { imagem in
                        URLImage(url: imagem,
                                 imageCache: imageCache
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
    }
}

struct GaleriaImagens_Previews: PreviewProvider {
    static var previews: some View {
        GaleriaImagens(
            imagens: [
            "/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg"
            ],
            baseURL: APIs.baseURL
        )
    }
}
