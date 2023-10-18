//
//  URLImage.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 03/08/23.
//

import SwiftUI

func defaultPlaceholder(_ name: String = "photo.fill") -> some View {
    Color(.lightGray)
}

struct clipComBorda<S>: ViewModifier where S: Shape {
    var shape: S
    
    func body(content: Content) -> some View {
        return
            content
            .overlay {
                shape
                    .stroke(lineWidth: 1.0)
            }
            .clipShape(shape)
    }
}

// Para poder acessar o Cache de qualquer lugar da aplicação
struct ImageCacheKey: EnvironmentKey {
    static let defaultValue: ImageCacheViewModel = ImageCacheViewModel()
}

extension EnvironmentValues {
    var imageCache: ImageCacheViewModel {
        get { return self[ImageCacheKey.self] }
        set { self[ImageCacheKey.self] = newValue }
    }
}

// Lida com Cache e tudo mais...
struct URLImage<P>: View where P : View {
    // private var imageCache: ImageCacheViewModel?
    @Environment(\.imageCache) private var imageCache: ImageCacheViewModel
    
    let url: URL
    let placeholder: () -> P
    
    init(url: URL, placeholder: @escaping () -> P) {
        self.url = url
        self.placeholder = placeholder
    }
    
    var body: some View {
        if let cached = imageCache.getImageCache(url: url) {
            cached
                .resizable()
                .aspectRatio(contentMode: .fit)
        } else {            
            AsyncImage(url: url) { phase in
                if let image = phase.image {
                    let _ = cacheAndRender(image)
                    
                    image
                        .resizable()
                } else if phase.error != nil {
                    ZStack {
                        placeholder()
                        
                        Spacer().background {
                            Text("?")
                                .font(.title)
                        }
                    }
                } else {
                    placeholder()
                }
            }
            .aspectRatio(contentMode: .fit)
        }
    }
    
    private func cacheAndRender(_ image: Image) {
        //if let imageCache {
            imageCache.storeImageCache(url: url, image: image)
        //}
    }
}

struct URLImage_Previews: PreviewProvider {
    static var previews: some View {
        let url = "/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg"
        List {
            ForEach(0..<10) { i in
                URLImage(url: APIs.baseURL.appendingPathComponent(url)) {
                    defaultPlaceholder()
                }
            }
        }
    }
}
