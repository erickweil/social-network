//
//  URLImage.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 03/08/23.
//

import SwiftUI

func defaultPlaceholder(_ name: String = "photo.fill") -> some View {
    Image(systemName: name)
        .resizable()
        .opacity(0.25)
}

// Lida com Cache e tudo mais...
struct URLImage<P>: View where P : View {
    @EnvironmentObject private var store: AppDataStore
    
    let url: URL
    let placeholder: () -> P
    
    init(url: URL, placeholder: @escaping () -> P) {
        self.url = url
        self.placeholder = placeholder
    }
    
    var body: some View {
        if let cached = store.imageCache.getImageCache(url: url) {
            cached
                .resizable()
                .aspectRatio(contentMode: .fit)
                .border(.blue)
        } else {            
            AsyncImage(url: url) { phase in
                if let image = phase.image {
                    cacheAndRender(image)
                        .resizable()
                } else if phase.error != nil {
                    ZStack {
                        placeholder()
                        
                        Spacer().background {
                            Text("Erro ao carregar imagem")
                                .font(.title)
                        }
                    }
                } else {
                    placeholder()
                }
            }
            .aspectRatio(contentMode: .fit)
            .border(.red)
            
        }
    }
    
    private func cacheAndRender(_ image: Image) -> Image {
        store.imageCache.storeImageCache(url: url, image: image)
        
        return image
    }
}

struct URLImage_Previews: PreviewProvider {
    static var previews: some View {
        let url = "/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg"
        List {
            ForEach(0..<50) { i in
                URLImage(url: APIs.baseURL.appendingPathComponent(url)) {
                    defaultPlaceholder()
                }
            }
        }.environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
