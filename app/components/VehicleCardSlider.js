import React, { useRef, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

const VehicleCardSlider = ({ vehicles }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % vehicles.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, vehicles]);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const newIndex = Math.round(contentOffset / viewSize);
    setCurrentIndex(newIndex);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={vehicles}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <BlurView
              blurType="light"
              blurAmount={10}
              style={styles.blurView}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.brand || "N/A"}</Text>
              <Text style={styles.cardText}>
                {item?.numeroSerie || ""} {item?.type || ""}{" "}
                {item?.numeroMatricule || ""}
              </Text>
              <Text style={styles.cardSubText}>
                Date de début de l'assurance:{" "}
                {item.insuranceStartDate
                  ? new Date(item.insuranceStartDate).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text style={styles.cardSubText}>
                Date de fin de l'assurance:{" "}
                {item.insuranceEndDate
                  ? new Date(item.insuranceEndDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {vehicles.length > 0 && (
        <View style={styles.pagination}>
          {vehicles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 10,
  },
  cardContainer: {
    borderRadius: 12,
    marginBottom: 8,
    height: 150,
    overflow: "hidden",
    borderColor: "rgba(233, 233, 233, 0.9)",
    borderWidth: 1,
    marginRight: 16,
    width: 300,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 12,
    color: "#555",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 4,
  },
  paginationDotActive: {
    backgroundColor: "#2B6CB0",
  },
});

export default VehicleCardSlider;
