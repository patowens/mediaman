import "./index.css";
import Button from "../Button";
import AudioFileDefinitionList from "../AudioFileDefinitionList";
import { useEffect, useRef, useState } from "react";

function MediaForm() {
  const [audioState, setAudioState] = useState({
    hasFile: false,
    filename: "",
    duration_in_seconds: "",
    duration_in_hms: "",
    size_in_kb: "",
    sermon_title: "",
  });

  const [formState, setFormState] = useState({
    size_in_kb: "",
    duration_in_seconds: "",
    speaker_name: "",
    sermon_title: "",
    date: new Date().toISOString().substring(0, 10),
  });

  const fileInputRef = useRef();

  useEffect(() => {
    document.querySelector('input[type="file"]').onchange = function (e) {
      const reader = new FileReader();
      let fname = "";

      reader.onload = function (e) {
        let dv = new window.jDataView(this.result);
        let sermon_title = "";

        // ID3 DETAILS
        if (dv.getString(3, dv.byteLength - 128) === "TAG") {
          sermon_title = dv.getString(30, dv.tell());
        } else {
          // no ID3v1 data found.
        }

        let mp3Duration = new window.Mp3Duration();
        let fileDuration = Math.round(mp3Duration.getDuration(e.target.result));
        let fileDurationStr = window.getDurationInHMS(fileDuration);
        setAudioState({
          hasFile: true,
          duration_in_seconds: fileDuration,
          duration_in_hms: fileDurationStr,
          size_in_kb: this.result.byteLength,
          title: sermon_title || "",
          filename: encodeURIComponent(fname),
        });
        setFormState({
          ...formState,
          duration_in_seconds: fileDuration,
          size_in_kb: this.result.byteLength,
        });
      };
      fname = this.files[0].name;
      reader.readAsArrayBuffer(this.files[0]);
    };
  }, [fileInputRef]);

  function handleDateChange(e) {
    setFormState({
      ...formState,
      date: new Date(e.target.value).toISOString().substring(0, 10),
    });
  }

  function handleTitleChange(e, f) {
    setFormState({
      ...formState,
      sermon_title: e.target.value,
    });
  }

  function handleSpeakerChange(e, f) {
    setFormState({
      ...formState,
      speaker_name: e.target.value,
    });
  }

  function handleFilesizeChange(e, f) {
    console.log(e.target.value);
    setFormState({
      ...formState,
      size_in_kb: e.target.value,
    });
  }

  function handleDurationChange(e, f) {
    setFormState({
      ...formState,
      duration_in_seconds: e.target.value,
    });
  }

  function handleClickGenerate() {
    const obj = {
      ...formState,
      ...audioState,
    };

    console.log(obj);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dateSplit = obj.date.split('-')
    const day = dateSplit[2]
    const month = monthNames[dateSplit[1] -1]
    const year = dateSplit[0]

    const podcast = `<item>
    <title>${obj.sermon_title} (${obj.speaker_name})</title>
    <itunes:subtitle>Teachings From Montmorency Community Church</itunes:subtitle>
    <itunes:summary>${obj.sermon_title}</itunes:summary>
    <itunes:author>${obj.speaker_name}</itunes:author>
    <enclosure url="http://www.montycc.org/downloads/${obj.filename}" length="${obj.size_in_kb}" type="audio/mpeg"/>
    <guid>http://www.montycc.org/downloads/${obj.filename}</guid>
    <pubDate>Sun, ${day} ${month} ${year} 12:00:00 +1000</pubDate>
    <itunes:duration>${obj.duration_in_seconds}</itunes:duration>
    <itunes:keywords></itunes:keywords>
    <itunes:explicit>Clean</itunes:explicit>
    </item>`;

    const downloads = `
    <img 
      src="images/musicicon_blue.png" 
      width="20" height="20" 
      alt="musicicon"
    >&nbsp;&nbsp;${day} ${month} ${year}<br>
    <a href="downloads/${obj.filename}">${obj.speaker_name} - ${obj.sermon_title}</a><br>${Math.round((obj.size_in_kb + Number.EPSILON) * 100) / 100} Mb Download <br>
    <p></p>
    `;

    console.log(podcast)
    console.log(downloads)
  }

  return (
    <div className="MediaForm">
      <header className="MediaForm-header"></header>
      <div>
        <h1>Media Man</h1>

        <div className="FormWrapper">
          <label>Recorded Audio File</label>
          <input
            ref={fileInputRef}
            id="FileInput"
            placeholder="Recorded Audio File"
            type="file"
          ></input>

          <label>File details</label>
          <div className="FileDetails">
            <AudioFileDefinitionList defs={audioState} />
          </div>

          <label>Filesize (in kb)</label>
          <input
            placeholder="File size"
            type="text"
            value={formState.size_in_kb}
            onChange={handleFilesizeChange}
          ></input>

          <label>Duration (in seconds)</label>
          <input
            placeholder="Duration"
            type="text"
            value={formState.duration_in_seconds}
            onChange={handleDurationChange}
          ></input>

          <label>Speaker Name</label>
          <input
            placeholder="Speaker Name"
            type="text"
            value={formState.speaker_name}
            onChange={handleSpeakerChange}
          ></input>

          <label>Sermon Title</label>
          <input
            placeholder="Sermon Title"
            type="text"
            value={formState.sermon_title}
            onChange={handleTitleChange}
          ></input>

          <label>Date</label>
          <input
            placeholder="Date"
            type="date"
            value={formState.date}
            onChange={handleDateChange}
          ></input>

          <Button
            tabIndex={4}
            loading={false}
            text="GENERATE SNIPPETS"
            fn={handleClickGenerate}
          />
        </div>
      </div>
    </div>
  );
}

export default MediaForm;
