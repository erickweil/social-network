//
//  SideMenuDrawer.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

extension View {
    func sideMenuDrawer<C: View>(menuOpened: Binding<Bool>,menuContent: @escaping () -> C) -> some View {
        modifier(SideMenuDrawer(menuOpened: menuOpened,menuContent: menuContent))
    }
}

struct SideMenuDrawer<C>: ViewModifier where C: View {
    @Binding
    var menuOpened: Bool
    
    var menuContent: () -> C
    
    func body(content: Content) -> some View {
        content
        .overlay {
            ZStack {
                if menuOpened {
                    Color(.gray)
                        .opacity(0.5)
                        .transition(.opacity)
                        .onTapGesture {
                            menuOpened.toggle()
                        }
                    
                    menuContent()
                        .padding()
                        .background(Color(.systemBackground))
                        .padding(.trailing, 100)
                        .transition(.move(edge: .leading))
                }
            }
            .animation(.easeIn(duration: 0.15), value: menuOpened)
        }
    }
}


struct SideMenuDrawerTeste: View {
    @State var opened: Bool = false
    var body: some View {
        ViewExample(imageName: "phone.fill", color: .systemRed)
        .sideMenuDrawer(menuOpened: $opened) {
            VStack(alignment: .leading) {
                Color(.lightGray)
                    .frame(width: 60,height:60)
                    .clipShape(Circle())
                
                Color(.lightGray)
                .frame(height: 17.0)
                .padding(.top, 10)
                
                Color(.lightGray)
                .frame(height: 17.0)
                .padding(.top, 10)
                
                Divider()
                
                Spacer()
            }
        }
        .onTapGesture {
            opened.toggle()
        }
    }
}

struct SideMenuDrawer_Previews: PreviewProvider {
    static var previews: some View {
        SideMenuDrawerTeste()
    }
}
