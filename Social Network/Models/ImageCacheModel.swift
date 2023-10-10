//
//  ImageCacheModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

class ImageCacheViewModel {
    var cache: [String: Image]
    // APENAS TESTE
    static var n : Int = 0
    init() {
        print("Criou Image Cache \(ImageCacheViewModel.n)")
        ImageCacheViewModel.n += 1
        self.cache = [:]
    }
    
    func storeImageCache(url: URL, image: Image) {
        print(" \(ImageCacheViewModel.n) Guardou \(url) no cache. Cache possui \(cache.count) imagens")
        cache[url.absoluteString] = image
    }
    
    func getImageCache(url: URL) -> Image? {
        if let img = cache[url.absoluteString] {
            print(" \(ImageCacheViewModel.n) Obtendo do cache: \(url)")
            return img
        } else {
            print(" \(ImageCacheViewModel.n) Não achou no cache: \(url)")
            return nil
        }
    }
}
