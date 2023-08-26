//
//  ImageCacheModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

struct ImageCache {
    private var imageCache: [String: Image] = [:]
    
    mutating func storeImageCache(url: URL, image: Image) {
        print("Guardou \(url) no cache. Cache possui \(imageCache.count) imagens")
        imageCache[url.absoluteString] = image
    }
    
    func getImageCache(url: URL) -> Image? {

        if let img = imageCache[url.absoluteString] {
            print("Obtendo do cache: \(url)")
            return img
        } else {
            print("Não achou no cache: \(url)")
            return nil
        }
    }
}
