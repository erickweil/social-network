//
//  ImageCacheModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

class ImageCacheViewModel {
    var cache: [String: Image]
    
    init() {
        self.cache = [:]
    }
    
    func storeImageCache(url: URL, image: Image) {
        print("Guardou \(url) no cache. Cache possui \(cache.count) imagens")
        cache[url.absoluteString] = image
    }
    
    func getImageCache(url: URL) -> Image? {
        if let img = cache[url.absoluteString] {
            print("Obtendo do cache: \(url)")
            return img
        } else {
            print("Não achou no cache: \(url)")
            return nil
        }
    }
}
