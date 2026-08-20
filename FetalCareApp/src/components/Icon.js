import React from 'react';
import { View, StyleSheet } from 'react-native';

// Each icon is drawn with plain Views (borders, rotations, radius tricks).
// size = overall box, color = stroke/fill color, weight = stroke thickness.

export default function Icon({ name, size = 22, color = '#2B1B2E', weight = 2 }) {
  const s = size;
  const w = weight;

  switch (name) {
    case 'home':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View
            style={{
              width: 0, height: 0,
              borderLeftWidth: s / 2, borderRightWidth: s / 2, borderBottomWidth: s / 2.2,
              borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color,
            }}
          />
          <View style={{ width: s * 0.7, height: s * 0.45, borderWidth: w, borderTopWidth: 0, borderColor: color }} />
        </View>
      );

    case 'trend':
      return (
        <View style={{ width: s, height: s, justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: s * 0.9 }}>
            {[0.35, 0.6, 0.45, 0.85].map((h, i) => (
              <View
                key={i}
                style={{
                  width: s * 0.15, height: s * h, backgroundColor: color, marginRight: s * 0.08,
                  borderRadius: 2,
                }}
              />
            ))}
          </View>
        </View>
      );

    case 'baby':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.55, height: s * 0.55, borderRadius: s * 0.3, borderWidth: w, borderColor: color }} />
          <View style={{ width: s * 0.75, height: s * 0.35, borderRadius: s * 0.2, borderWidth: w, borderColor: color, marginTop: -s * 0.08 }} />
        </View>
      );

    case 'heart':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: s * 0.4, height: s * 0.4, borderRadius: s * 0.4, backgroundColor: color, marginRight: -s * 0.12, transform: [{ rotate: '-45deg' }] }} />
            <View style={{ width: s * 0.4, height: s * 0.4, borderRadius: s * 0.4, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
          </View>
        </View>
      );

    case 'kick':
      // stylized footprint: oval + small toe dots
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.42, height: s * 0.62, borderRadius: s * 0.3, backgroundColor: color }} />
          <View style={{ flexDirection: 'row', marginTop: -s * 0.05 }}>
            <View style={{ width: s * 0.12, height: s * 0.12, borderRadius: s * 0.1, backgroundColor: color, marginHorizontal: 1 }} />
            <View style={{ width: s * 0.14, height: s * 0.14, borderRadius: s * 0.1, backgroundColor: color, marginHorizontal: 1 }} />
            <View style={{ width: s * 0.12, height: s * 0.12, borderRadius: s * 0.1, backgroundColor: color, marginHorizontal: 1 }} />
          </View>
        </View>
      );

    case 'bulb':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.5, height: s * 0.5, borderRadius: s * 0.25, borderWidth: w, borderColor: color }} />
          <View style={{ width: s * 0.24, height: s * 0.14, borderWidth: w, borderColor: color, marginTop: -1 }} />
        </View>
      );

    case 'family':
      return (
        <View style={{ width: s, height: s, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginRight: -s * 0.08 }}>
            <View style={{ width: s * 0.24, height: s * 0.24, borderRadius: s * 0.12, backgroundColor: color }} />
            <View style={{ width: s * 0.32, height: s * 0.3, borderTopLeftRadius: s * 0.16, borderTopRightRadius: s * 0.16, backgroundColor: color, marginTop: 1 }} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: s * 0.3, height: s * 0.3, borderRadius: s * 0.15, backgroundColor: color }} />
            <View style={{ width: s * 0.4, height: s * 0.38, borderTopLeftRadius: s * 0.2, borderTopRightRadius: s * 0.2, backgroundColor: color, marginTop: 1 }} />
          </View>
        </View>
      );

    case 'settings':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.6, height: s * 0.6, borderRadius: s * 0.3, borderWidth: s * 0.14, borderColor: color }} />
        </View>
      );

    case 'check':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ transform: [{ rotate: '45deg' }] }}>
            <View style={{ width: s * 0.16, height: s * 0.4, backgroundColor: color, position: 'absolute', right: s * 0.05, bottom: 0 }} />
            <View style={{ width: s * 0.55, height: s * 0.16, backgroundColor: color, position: 'absolute', right: 0, bottom: 0 }} />
          </View>
        </View>
      );

    case 'alert':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 0, height: 0,
              borderLeftWidth: s / 2, borderRightWidth: s / 2, borderBottomWidth: s * 0.86,
              borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color,
            }}
          />
          <View style={{ position: 'absolute', top: s * 0.32, width: w, height: s * 0.22, backgroundColor: '#fff' }} />
          <View style={{ position: 'absolute', top: s * 0.62, width: w * 1.4, height: w * 1.4, borderRadius: w, backgroundColor: '#fff' }} />
        </View>
      );

    case 'back':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s * 0.4, height: s * 0.4,
              borderLeftWidth: w, borderBottomWidth: w, borderColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );

    case 'clock':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.75, height: s * 0.75, borderRadius: s * 0.4, borderWidth: w, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: w, height: s * 0.22, backgroundColor: color, position: 'absolute', top: s * 0.13 }} />
            <View style={{ width: s * 0.16, height: w, backgroundColor: color, position: 'absolute', top: s * 0.34, left: s * 0.37 }} />
          </View>
        </View>
      );

    case 'leaf':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s * 0.5, height: s * 0.78, borderRadius: s * 0.4,
              backgroundColor: color, transform: [{ rotate: '45deg' }],
            }}
          />
          <View style={{ position: 'absolute', width: s * 0.05, height: s * 0.4, backgroundColor: '#fff', transform: [{ rotate: '45deg' }] }} />
        </View>
      );

    case 'lotus':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{ width: s * 0.26, height: s * 0.5, borderTopLeftRadius: s * 0.26, borderTopRightRadius: s * 0.05, backgroundColor: color, marginRight: 1, transform: [{ rotate: '-18deg' }] }} />
            <View style={{ width: s * 0.28, height: s * 0.62, borderTopLeftRadius: s * 0.28, borderTopRightRadius: s * 0.28, backgroundColor: color }} />
            <View style={{ width: s * 0.26, height: s * 0.5, borderTopLeftRadius: s * 0.05, borderTopRightRadius: s * 0.26, backgroundColor: color, marginLeft: 1, transform: [{ rotate: '18deg' }] }} />
          </View>
          <View style={{ width: s * 0.9, height: s * 0.1, borderRadius: s * 0.05, backgroundColor: color, marginTop: 2, opacity: 0.5 }} />
        </View>
      );

    case 'moon':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.66, height: s * 0.66, borderRadius: s * 0.33, backgroundColor: color }} />
          <View style={{ position: 'absolute', width: s * 0.56, height: s * 0.56, borderRadius: s * 0.28, backgroundColor: '#fff', right: s * 0.14 }} />
        </View>
      );

    case 'flower':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: s * 0.34, height: s * 0.34, borderRadius: s * 0.17,
                backgroundColor: color, opacity: 0.85,
                transform: [{ rotate: `${i * 90}deg` }, { translateY: -s * 0.2 }],
              }}
            />
          ))}
          <View style={{ width: s * 0.24, height: s * 0.24, borderRadius: s * 0.12, backgroundColor: '#fff' }} />
        </View>
      );

    default:
      return <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: color }} />;
  }
}
