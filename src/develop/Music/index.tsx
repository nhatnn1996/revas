import * as React from "react";
import { View, Text, Image, ScrollView, RevasScrollEvent, AnimatedValue, withContext } from "../../revas";
import { ABS_FULL, DEFAULT_TEXT } from "./styles";
import { MUSICS, MusicItemData } from "./data";
import Back from "../common/back";
const sliceMusic = MUSICS;
// sliceMusic.splice(0, 5);

@withContext
export default class MusicApp extends React.Component {
  state = {
    index: 0,
    picking: false,
  };

  transaction = new AnimatedValue(1);

  style = {
    opacity: this.transaction,
    flex: 1,
    animated: true,
  };

  inner = {
    marginTop: 0,
    marginBottom: this.context.clientHeight! / 2 - 57,
    height: 500,
    flexDirection: "row",
  };

  startScroll = () => {
    this.setState({ picking: true });
  };
  endScroll = () => {};

  checkIndex = (e: any) => {
    const index = Math.round(e.y / 113);
    this.setState({ index, picking: false });
  };

  renderMusic = (item: MusicItemData, index: number) => (
    <View style={styles.musicItem} key={index}>
      <Image style={styles.musicCover} src={item.cover} />
    </View>
  );
  render() {
    let music = [...MUSICS, ...sliceMusic];
    return (
      <View style={styles.container}>
        <View style={this.style}>
          <ScrollView style={styles.list} paging={113} horizontal={true} onScrollStart={this.startScroll} onScrollEnd={this.checkIndex}>
            <View style={this.inner} cache>
              {music.map(this.renderMusic)}
            </View>
          </ScrollView>
          <Back {...this.props} />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  top: {
    ...ABS_FULL,
    bottom: "60%",
  },
  bottom: {
    ...ABS_FULL,
    top: "60%",
  },
  list: {
    flex: 1,
  },
  musicItem: {},
  musicCover: {
    width: 400,
    height: 255,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  musicInfo: {
    flex: 1,
  },
  musicName: {
    ...DEFAULT_TEXT,
    fontSize: 16,
    opacity: 0.8,
    marginTop: 20,
    marginLeft: 20,
    color: "#fff",
  },
  musicSinger: {
    ...DEFAULT_TEXT,
    fontSize: 14,
    marginTop: 10,
    marginLeft: 20,
    fontWeight: "400",
    opacity: 0.3,
  },
  line: {
    height: 1,
    backgroundColor: "#98B3B0",
    opacity: 0.1,
    marginTop: 5,
  },
};
